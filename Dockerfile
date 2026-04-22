FROM golang:1.26 AS builder

WORKDIR /build

COPY go.mod go.sum ./

RUN go mod download

COPY . .

RUN CGO_ENABLED=0 GOOS=linux go build -ldflags "-s -w" -o gramfel .

FROM gcr.io/distroless/static-debian13:nonroot AS bot

WORKDIR /bot

COPY --from=builder /build/gramfel .

ENTRYPOINT ["/bot/gramfel"]
