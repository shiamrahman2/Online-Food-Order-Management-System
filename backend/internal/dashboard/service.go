package dashboard

import "context"

type Service interface {
	GetStats(ctx context.Context) (*Stats, error)
}

type service struct {
	repo Repository
}

func NewService(repo Repository) Service {
	return &service{repo: repo}
}

func (s *service) GetStats(ctx context.Context) (*Stats, error) {
	return s.repo.GetStats(ctx)
}