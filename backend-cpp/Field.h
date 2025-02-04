#pragma once
#include <memory>
#include <vector>

#include "Point.h"
#include "Shell.h"
struct Field
{
private:
	short shell_count = 0;

	bool is_not_last_shell(short) const;
	std::shared_ptr<Point> get_point_at(short, short) const;
	void handle_connection_to_left(short, short);
	void handle_connection_to_up_left(short, short);
	void handle_connection_to_up(short, short);
	void handle_connection_to_up_right(short, short);
	void handle_connection_to_right(short, short);
	void handle_connection_to_down_right(short, short);
	void handle_connection_to_down(short, short);
	void handle_connection_to_down_left(short, short);
	void init_field();
public:
	static const short points_per_shell = 8;
	static int get_points_in_field(short);
	Field() = default;
	Field(short);
	~Field() = default;

	std::shared_ptr<Point> core;
	std::unique_ptr<std::vector<std::shared_ptr<Shell>>> shells;
};

