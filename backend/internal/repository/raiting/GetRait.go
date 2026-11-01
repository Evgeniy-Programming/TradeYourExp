package raiting

func (r *RaitRepository) GetMyRait(userId string) (string, error) {
	var rait string
	q := `SELECT raiting FROM users WHERE id = $1`
	err := r.db.QueryRow(q, userId).Scan(&rait)
	return rait, err
}

func (r *RaitRepository) GetUserRait(username string) (string, error) {
	var rait string
	q := `SELECT raiting FROM users WHERE username = $1`
	err := r.db.QueryRow(q, username).Scan(&rait)
	return rait, err
}
