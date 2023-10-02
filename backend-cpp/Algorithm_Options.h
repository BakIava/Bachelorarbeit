#pragma once
struct Algorithm_Options
{
public:
	Algorithm_Options(double alpha = 0.99, double epsilon = 0.5, double gamma = 0.99, double reward = 0.01, bool random_q = false);
	~Algorithm_Options() = default;

	double alpha;
	double epsilon;
	double gamma;
	double reward;
	bool random_q;
};

