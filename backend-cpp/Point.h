#pragma once
#include <vector>

#include "Connection.h"
#include "Stone.h" 

struct Point
{
public:
	Point() = default;
	Point(int pos, int shell, bool is_core = false);
	~Point() = default;

	void add_connection(const std::shared_ptr<Point>&, Action);

	std::unique_ptr<int> pos = nullptr;
	std::unique_ptr<int> shell = nullptr;
	std::unique_ptr<bool> is_core = nullptr;
	std::unique_ptr<std::vector<std::unique_ptr<Connection>>> connections = nullptr;
	std::unique_ptr<Stone> fill = nullptr;
};

