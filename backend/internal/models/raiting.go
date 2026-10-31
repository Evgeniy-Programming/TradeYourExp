package models

type LogicRaitRequest struct {
	ReceivedId string `json:"received_id"`
	SentId     string `json:"sent_id"`
	Mark       int    `json:"mark"`
}

type RaitRequest struct {
	ReceivedId string `json:"received_id"`
	Mark       int    `json:"mark"`
}
