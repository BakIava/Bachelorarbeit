#include "Connection.h"

Connection::Connection(const std::shared_ptr<Point>& point, Action action)
{
	this->point = point;
	this->action = std::make_unique<Action>(action);
}