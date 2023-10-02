#include "Field.h"

Field::Field(short shell_count) : shell_count{ shell_count }
{
	this->core = std::make_shared<Point>(0, 0, true);
	this->shells = std::make_unique<std::vector<std::shared_ptr<Shell>>>();

	this->init_field();
}

int Field::get_points_in_field(short shell_count)
{
	return points_per_shell * shell_count + 1;
}

std::shared_ptr<Point> Field::get_point_at(short shell_index, short point_index) const
{
	return this
		->shells.get()->at(shell_index)
		->points.get()->at(point_index);
}

bool Field::is_not_last_shell(short shell_index) const
{
	return shell_index < this->shell_count - 1;
}

void Field::handle_connection_to_left(short shell_index, short point_index)
{
	if (point_index == 1 || point_index == 7) return;

	auto const& point = get_point_at(shell_index, point_index);

	if (point_index == 0 && is_not_last_shell(shell_index))
	{
		auto const& target_point = get_point_at(shell_index + 1, point_index);
		point->add_connection(target_point, Action::LEFT);
	}
	else if (point_index == 4)
	{
		if (shell_index == 0)
		{
			point->add_connection(this->core, Action::LEFT);
		}
		else
		{
			auto const& target_point = get_point_at(shell_index - 1, point_index);
			point->add_connection(target_point, Action::LEFT);
		}
	}
	else if (point_index == 2 || point_index == 3)
	{
		auto const& target_point = get_point_at(shell_index, point_index - 1);
		point->add_connection(target_point, Action::LEFT);
	}
	else if (point_index == 5 || point_index == 6)
	{
		auto const& target_point = get_point_at(shell_index, point_index + 1);
		point->add_connection(target_point, Action::LEFT);
	}
}

void Field::handle_connection_to_up_left(short shell_index, short point_index)
{
	if (point_index != 1 && point_index != 5) return;

	auto const& point = get_point_at(shell_index, point_index);

	if (point_index == 1 && is_not_last_shell(shell_index))
	{
		auto const& target_point = get_point_at(shell_index + 1, point_index);
		point->add_connection(target_point, Action::UP_LEFT);
	}
	else if (point_index == 5)
	{
		if (shell_index == 0)
		{
			point->add_connection(this->core, Action::UP_LEFT);
		}
		else
		{
			auto const& target_point = get_point_at(shell_index - 1, point_index);
		}
	}
}

void Field::handle_connection_to_up(short shell_index, short point_index)
{
	if (point_index == 1 || point_index == 3) return;

	auto const& point = get_point_at(shell_index, point_index);

	if (point_index == 2 && is_not_last_shell(shell_index))
	{
		auto const& target_point = get_point_at(shell_index + 1, point_index);
		point->add_connection(target_point, Action::UP);
	}
	else if (point_index == 0)
	{
		auto const& target_point = get_point_at(shell_index, point_index + 1);
		point->add_connection(target_point, Action::UP);
	}
	else if (point_index == 4 || point_index == 5)
	{
		auto const& target_point = get_point_at(shell_index, point_index - 1);
		point->add_connection(target_point, Action::UP);
	}
	else if (point_index == 7)
	{
		auto const& target_point = get_point_at(shell_index, 0);
		point->add_connection(target_point, Action::UP);
	}
	else if (point_index == 6)
	{
		if (shell_index == 0)
		{
			point->add_connection(this->core, Action::UP);
		}
		else
		{
			auto const& target_point = get_point_at(shell_index - 1, point_index);
			point->add_connection(target_point, Action::UP);
		}
	}
}

void Field::handle_connection_to_up_right(short shell_index, short point_index)
{
	if (point_index != 3 && point_index != 7) return;

	auto const& point = get_point_at(shell_index, point_index);

	if (point_index == 3 && is_not_last_shell(shell_index))
	{
		auto const& target_point = get_point_at(shell_index + 1, point_index);
		point->add_connection(target_point, Action::UP_RIGHT);
	}
	else if (point_index == 7)
	{
		if (shell_index == 0)
		{
			point->add_connection(this->core, Action::UP_RIGHT);
		}
		else
		{
			auto const& target_point = get_point_at(shell_index - 1, point_index);
			point->add_connection(target_point, Action::UP_RIGHT);
		}
	}
}

void Field::handle_connection_to_right(short shell_index, short point_index)
{
	if (point_index == 3 || point_index == 5) return;

	auto const& point = get_point_at(shell_index, point_index);

	if (point_index == 4 && is_not_last_shell(shell_index))
	{
		auto const& target_point = get_point_at(shell_index + 1, point_index);
		point->add_connection(target_point, Action::RIGHT);
	}
	else if (point_index == 1 || point_index == 2)
	{
		auto const& target_point = get_point_at(shell_index, point_index + 1);
		point->add_connection(target_point, Action::RIGHT);
	}
	else if (point_index == 6 || point_index == 7)
	{
		auto const& target_point = get_point_at(shell_index, point_index - 1);
		point->add_connection(target_point, Action::RIGHT);
	}
	else if (point_index == 0)
	{
		if (shell_index == 0)
		{
			point->add_connection(this->core, Action::RIGHT);
		}
		else
		{
			auto const& target_point = get_point_at(shell_index - 1, point_index);
			point->add_connection(target_point, Action::RIGHT);
		}
	}
}

void Field::handle_connection_to_down_right(short shell_index, short point_index)
{
	if (point_index != 1 && point_index != 5) return;

	auto const& point = get_point_at(shell_index, point_index);

	if (point_index == 5 && is_not_last_shell(shell_index))
	{
		auto const& target_point = get_point_at(shell_index + 1, point_index);
		point->add_connection(target_point, Action::DOWN_RIGHT);
	}
	else if (point_index == 1)
	{
		if (shell_index == 0)
		{
			point->add_connection(this->core, Action::DOWN_RIGHT);
		}
		else
		{
			auto const& target_point = get_point_at(shell_index - 1, point_index);
			point->add_connection(target_point, Action::DOWN_RIGHT);
		}
	}
}

void Field::handle_connection_to_down(short shell_index, short point_index)
{
	if (point_index == 7 || point_index == 5) return;

	auto const& point = get_point_at(shell_index, point_index);

	if (point_index == 6 && is_not_last_shell(shell_index))
	{
		auto const& target_point = get_point_at(shell_index + 1, point_index);
		point->add_connection(target_point, Action::DOWN);
	}
	else if (point_index == 3 || point_index == 4)
	{
		auto const& target_point = get_point_at(shell_index, point_index + 1);
		point->add_connection(target_point, Action::DOWN);
	}
	else if (point_index == 0)
	{
		auto const& target_point = get_point_at(shell_index, 7);
		point->add_connection(target_point, Action::DOWN);
	}
	else if (point_index == 1)
	{
		auto const& target_point = get_point_at(shell_index, point_index - 1);
		point->add_connection(target_point, Action::DOWN);
	}
	else if (point_index == 2)
	{
		if (shell_index == 0)
		{
			point->add_connection(this->core, Action::DOWN);
		}
		else
		{
			auto const& target_point = get_point_at(shell_index - 1, point_index);
			point->add_connection(target_point, Action::DOWN);
		}
	}
}

void Field::handle_connection_to_down_left(short shell_index, short point_index)
{
	if (point_index != 3 && point_index != 7) return;

	auto const& point = get_point_at(shell_index, point_index);

	if (point_index == 7 && is_not_last_shell(shell_index))
	{
		auto const& target_point = get_point_at(shell_index + 1, point_index);
		point->add_connection(target_point, Action::DOWN_LEFT);
	}
	else if (point_index == 3)
	{
		if (shell_index == 0)
		{
			point->add_connection(this->core, Action::DOWN_LEFT);
		}
		else
		{
			auto const& target_point = get_point_at(shell_index - 1, point_index);
			point->add_connection(target_point, Action::DOWN_LEFT);
		}
	}
}

void Field::init_field()
{
	for (size_t i = 0; i < this->shell_count; ++i)
	{
		auto shells = this->shells.get();
		auto shell = std::make_shared<Shell>();
		for (size_t j = 0; j < this->points_per_shell; ++j)
		{
			shell->points.get()->push_back(std::make_unique<Point>(j, i));
		}

		shells->push_back(shell);
	}

	for (size_t i = 0; i < this->points_per_shell; ++i)
	{
		auto core_connections = this->core.get()->connections.get();
		auto const& first_shell = this->shells.get()->at(0);
		auto const& curr_shell_point = first_shell->points.get()->at(i);

		core_connections->push_back(std::make_unique<Connection>(curr_shell_point, Action(i)));
	}

	for (short i = 0; i < this->shell_count; ++i)
	{
		for (short j = 0; j < this->points_per_shell; j++)
		{
			handle_connection_to_left(i, j);
			handle_connection_to_up_left(i, j);
			handle_connection_to_up(i, j);
			handle_connection_to_up_right(i, j);
			handle_connection_to_right(i, j);
			handle_connection_to_down_right(i, j);
			handle_connection_to_down(i, j);
			handle_connection_to_down_left(i, j);
		}
	}
}