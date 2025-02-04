#include "Point.h"

Point::Point(int pos, int shell, bool is_core)
{
	this->pos = std::make_unique<int>(pos);
	this->shell = std::make_unique<int>(shell);
	this->is_core = std::make_unique<bool>(is_core);
	this->connections = std::make_unique<std::vector<std::unique_ptr<Connection>>>();
	this->fill = nullptr;
}

void Point::add_connection(const std::shared_ptr<Point>& point, Action action) 
{
	this->connections.get()->push_back(std::make_unique<Connection>(point, action));
}
