module Trade-y-exp/auth_service

go 1.25.0

require (
	github.com/golang-jwt/jwt/v5 v5.2.0
	github.com/google/uuid v1.6.0
	github.com/jackc/pgx/v5 v5.5.4
	golang.org/x/crypto v0.55.0
	google.golang.org/grpc v1.83.2
	google.golang.org/protobuf v1.36.12
)

require (
	github.com/jackc/pgpassfile v1.0.0 // indirect
	github.com/jackc/pgservicefile v0.0.0-20221227161230-091c0ba34f0a // indirect
	github.com/jackc/puddle/v2 v2.2.1 // indirect
	golang.org/x/net v0.58.0 // indirect
	golang.org/x/sync v0.22.0 // indirect
	golang.org/x/sys v0.47.0 // indirect
	golang.org/x/text v0.41.0 // indirect
	google.golang.org/genproto/googleapis/rpc v0.0.0-20260526163538-3dc84a4a5aaa // indirect
)

replace (
	golang.org/x/crypto => golang.org/x/crypto v0.44.0
	golang.org/x/mod => golang.org/x/mod v0.29.0
	golang.org/x/net => golang.org/x/net v0.47.0
	golang.org/x/sync => golang.org/x/sync v0.18.0
	golang.org/x/sys => golang.org/x/sys v0.38.0
	golang.org/x/text => golang.org/x/text v0.31.0
	golang.org/x/tools => golang.org/x/tools v0.38.0
)
