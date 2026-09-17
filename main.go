package main

import (
	"bytes"
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"io/fs"
	"log/slog"
	"net/http"
	"net/url"
	"os"
	"reflect"
	"strings"
	"time"

	"github.com/expr-lang/expr"
	"github.com/joho/godotenv"
	"github.com/kelseyhightower/envconfig"
	"github.com/lmittmann/tint"
)

type Config struct {
	WebhookUrlGeneral string `split_words:"true" required:"true"`
	MessageExpression string `split_words:"true" default:"\"<:harrhy:569924236353994782>\""`
}

type discordError struct {
	Code    int    `json:"code"`
	Message string `json:"message"`
}

func evaluateMessage(expression string) (string, error) {
	program, err := expr.Compile(expression, expr.AsKind(reflect.String))
	if err != nil {
		return "", fmt.Errorf("error compiling message expression: %w", err)
	}

	result, err := expr.Run(program, nil)
	if err != nil {
		return "", fmt.Errorf("error evaluating message expression: %w", err)
	}

	return result.(string), nil
}

func Run() error {
	err := godotenv.Load()
	if err != nil && !errors.Is(err, fs.ErrNotExist) {
		slog.Warn("Error parsing .env", "err", err)
	}

	var config Config

	err = envconfig.Process("gramfel", &config)
	if err != nil {
		return fmt.Errorf("error populating config: %w", err)
	}

	message, err := evaluateMessage(config.MessageExpression)
	if err != nil {
		return err
	}

	ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
	defer cancel()

	reqBody := map[string]string{
		"content": message,
	}

	buf := new(bytes.Buffer)
	err = json.NewEncoder(buf).Encode(reqBody)
	if err != nil {
		return fmt.Errorf("error encoding request body: %w", err)
	}

	req, err := http.NewRequestWithContext(ctx, http.MethodPost, config.WebhookUrlGeneral, buf)
	if err != nil {
		return fmt.Errorf("error creating request: %w", err)
	}

	req.Header.Set("Content-Type", "application/json")

	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		if urlErr, ok := errors.AsType[*url.Error](err); ok {
			return fmt.Errorf("error sending request: %w", urlErr.Err)
		}

		return fmt.Errorf("error sending request: %w", err)
	}
	defer func() { _ = resp.Body.Close() }()

	if resp.StatusCode != http.StatusNoContent {
		var discordErr discordError
		if err := json.NewDecoder(resp.Body).Decode(&discordErr); err == nil && discordErr.Message != "" {
			return fmt.Errorf(
				"unexpected status code %d: Discord error %d: %s",
				resp.StatusCode,
				discordErr.Code,
				strings.TrimSpace(discordErr.Message),
			)
		}

		return fmt.Errorf("unexpected status code: %d", resp.StatusCode)
	}

	return nil
}

func main() {
	slog.SetDefault(slog.New(
		tint.NewTextHandler(
			os.Stderr,
			&tint.Options{
				TimeFormat: time.Kitchen,
				Level:      slog.LevelInfo,
			},
		),
	))

	err := Run()
	if err != nil {
		slog.Error("Failed to run", "error", err)
		os.Exit(1)
	}
}
