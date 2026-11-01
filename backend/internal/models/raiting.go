package models

import "time"

type Raiting struct {
	Id         string    `json:"id"`
	ReceivedId string    `json:"received_id"`
	SentId     string    `json:"sent_id"`
	LastRait   float32   `json:"last_raiting"`
	NewRait    float32   `json:"new_raiting"`
	CreatedAt  time.Time `json:"created_at"`
}
type LogicRaitRequest struct {
	ReceivedId string `json:"received_id"`
	SentId     string `json:"sent_id"`
	Mark       int    `json:"mark"`
}

type RaitRequest struct {
	ReceivedId string `json:"received_id"`
	Mark       int    `json:"mark"`
}

type UpdateRaitRequest struct {
	ReceivedId string `json:"received_id"`
	Mark       int    `json:"mark"`
}
