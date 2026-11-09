package raiting

import (
	"Trade-y-exp/internal/models"
)

func (r *RaitRepository) GetRaitHistory(id string) ([]models.Raiting, error) {
	q := `SELECT id, received_id, sent_id, last_raiting, new_raiting, created_at FROM raiting WHERE received_id = $1 OR sent_id = $1`
	rows, err := r.db.Query(q, id)
	if err != nil {
		return []models.Raiting{}, err
	}
	defer rows.Close()

	var res []models.Raiting
	for rows.Next() {
		var rait models.Raiting
		if err := rows.Scan(&rait.Id, &rait.ReceivedId, &rait.SentId, &rait.LastRait,
			&rait.NewRait, &rait.CreatedAt); err != nil {
			return nil, err
		}
		res = append(res, rait)
	}
	return res, rows.Err()
}

func (r *RaitRepository) GetInfluenceRait(receivedId string, sentId string) ([]models.Raiting, error) {
	q := `SELECT id, received_id, sent_id, last_raiting, new_raiting, created_at FROM raiting WHERE received_id = $1 OR sent_id = $2`
	rows, err := r.db.Query(q, receivedId, sentId)
	if err != nil {
		return []models.Raiting{}, err
	}
	defer rows.Close()

	var res []models.Raiting
	for rows.Next() {
		var rait models.Raiting
		if err := rows.Scan(&rait.Id, &rait.ReceivedId, &rait.SentId, &rait.LastRait,
			&rait.NewRait, &rait.CreatedAt); err != nil {
			return nil, err
		}
		res = append(res, rait)
	}
	return res, rows.Err()
}
