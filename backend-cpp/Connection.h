#pragma once
#include <memory>

#include "Action.h"

struct Point;

struct Connection
{
public:
	Connection(const std::shared_ptr<Point>&, Action);
	~Connection() = default;

	std::weak_ptr<Point> point;
	std::unique_ptr<Action> action = nullptr;
};