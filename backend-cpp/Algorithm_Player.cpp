#include "Algorithm_Player.h"

#include <iostream>
#include <chrono>


Algorithm_Player::Algorithm_Player(const std::string& name, int shell_count, const Algorithm_Options& options)
	: IPlayer{ name, shell_count },
	alpha{ options.alpha },
	epsilon{ options.epsilon },
	gamma{ options.gamma },
	reward{ options.reward },
	random_q{ options.random_q }
{
	this->init_q();
}

std::vector<StoneDistribution> Algorithm_Player::calculate_stone_distributions()
{
	auto stone_distribution = std::vector<StoneDistribution>();

	auto p1_first = true;
	auto all_distribution = false;

	for (size_t i = 0; i < this->get_stones_left() * 2; i++)
	{
		int dist_count = 0;

		while (!all_distribution)
		{
			StoneDistribution dist{ 0, 0 };

			bool place_p1{ p1_first };
			p1_first = !p1_first;

			for (size_t j = i; j > 0; --j)
			{
				place_p1 ? dist.p1++ : dist.p2++;
				place_p1 = !place_p1;
			}

			stone_distribution.push_back(dist);
			dist_count++;
			// Either have even number of stones and do it once
			// Or repeat it with p2 as first
			all_distribution = i % 2 == 0 || dist_count == 2;
		}

		all_distribution = false;
		p1_first = true;
	}

	return stone_distribution;
}

std::vector<std::string> Algorithm_Player::get_states_for_distribution(const StoneDistribution& dist)
{
	auto const stones = dist.p1 + dist.p2;

	auto field_combi = std::vector<std::string>();
	auto points_in_field = Field::get_points_in_field(this->get_shell_count());
	auto states_count = static_cast<unsigned long long>(pow(2.0, points_in_field));
	for (size_t i = 0; i < states_count; ++i)
	{
		std::bitset<32> bits {i};
		auto bits_str = bits
			.to_string()
			.substr(32 - points_in_field);

		short bit_count = 0;
		for (auto bit : bits_str)
		{
			if (bit == '1') bit_count++;
			if (bit_count > stones) break;
		}

		if (bit_count == stones) field_combi.push_back(bits_str);
	}

	auto stone_combi = std::vector<std::string>();
	auto stones_states_count = static_cast<unsigned long long>(pow(2.0, stones));
	for (size_t i = 0; i < stones_states_count; ++i)
	{
		std::bitset<32> bits {i};
		auto bits_str = bits
			.to_string()
			.substr((32 - points_in_field) + (points_in_field - stones));

		short bit_count = 0;
		for (auto bit : bits_str)
		{
			if (bit == '1') bit_count++;
			if (bit_count > stones) break;
		}

		if (bit_count == dist.p1) stone_combi.push_back(bits_str);
	}

	auto converted_fields = std::vector<std::string>();
	for (size_t i = 0; i < field_combi.size(); ++i)
	{
		for (auto const combi : stone_combi)
		{
			auto converted_field = field_combi.at(i);
			auto current_char = 0;

			for (size_t j = 0; j < converted_field.size(); ++j)
			{
				if (field_combi.at(i).at(j) != '1') continue;

				if (combi.at(current_char) == '1')
				{
					converted_field.insert(j, "1");
					converted_field.erase(j + 1, 1);
				}
				else
				{
					converted_field.insert(j, "2");
					converted_field.erase(j + 1, 1);
				}

				current_char++;
			}

			converted_fields.push_back(converted_field);
		}
	}

	return converted_fields;
}

std::vector<int> Algorithm_Player::get_place_actions_for_state(const std::string& state)
{
	auto actions = std::vector<int>();

	for (int i = 0; i < state.size(); ++i)
	{
		if (state.at(i) == '0') actions.push_back(i);
	}

	return actions;
}

bool Algorithm_Player::check_if_state_is_goal(const std::string& state, char player)
{
	if (state.at(0) != player) return false;

	auto win_combis = std::vector<std::vector<int>>();

	for (auto const& combi : win_combis)
	{
		auto won = true;
		for (size_t i = 0; i < this->get_shell_count(); ++i)
		{
			if (state.at(i * Field::points_per_shell + combi.at(0) + 1) != player ||
				state.at(i * Field::points_per_shell + combi.at(1) + 1) != player) won = false;
		}

		if (won) return true;
	}

	return false;
}

void Algorithm_Player::add_place_phase_state_actions()
{
	auto const distributions = this->calculate_stone_distributions();

	//std::cout << "distributions: " << distributions.size() << std::endl;

	//auto all_states = std::vector<std::string>();
	for (auto const dist : distributions)
	{
		//std::cout << "start calculating: p1 = " << dist.p1 << ", p2 = " << dist.p2 << std::endl;
		//auto start = std::chrono::system_clock::now();
		auto const states = this->get_states_for_distribution(dist);
		//auto end = std::chrono::system_clock::now();
		//std::chrono::duration<double> elapsed_seconds = end - start;
		//std::cout << "finished calculating in " << elapsed_seconds.count() << "s" << std::endl;
		for (auto const& state : states)
		{
			auto const actions = this->get_place_actions_for_state(state);

			if (!this->q.count(state)) this->q[state] = std::map<std::any, int>();

			for (auto const& action : actions)
			{
				//if (this->check_if_state_is_goal(state, '1')) this->q[state][1] = this->random_q ? 0 : 1;
				//else this->q[state][action] = this->random_q ? rand() : 0;
			}
		}

		//std::cout << "calculated states: " << states.size() << std::endl;
		//all_states.insert(all_states.end(), states.begin(), states.end());
	}
}

Stringified_Field Algorithm_Player::get_field(const std::string_view& state) const
{
	Stringified_Field field{};
	field.core = state.at(0);

	std::smatch match;
	std::regex const split_regex(".{1,8}");
	std::string state_without_core {state.substr(0)};
	std::regex_match(state_without_core, match, split_regex);
	for (auto const& m : match)
	{
		field.shells.push_back(m);
	}

	return field;
}

std::vector<MoveAction> Algorithm_Player::get_move_actions_for_state(const std::string& state)
{
	auto actions = std::vector<MoveAction>();

	auto const field = this->get_field(state);

	if (field.core == '1')
	{
		auto const first_shell = field.shells.at(0);

		for (size_t i = 0; i < Field::points_per_shell; ++i)
		{
			if (first_shell.at(i) == '0')
			{
				actions.push_back(MoveAction{ 0, Action(i) });
			}
		}

		for (short i = 0; i < field.shells.size(); ++i)
		{
			auto const& shell = field.shells.at(i);
			for (short j = 0; j < shell.size(); ++j)
			{
				if (shell.at(j) != '1') continue;
				short const pos = i * 8 + j + 1;

				if (j == 0)
				{
					if (shell.at(1) == '0') actions.push_back(MoveAction{ pos, Action::UP });

					if (i == 0)
					{
						if (field.core == '0') actions.push_back(MoveAction{ pos, Action::RIGHT });
					}
					else
					{
						if (field.shells.at(i - 1).at(0) == '0') actions.push_back(MoveAction{ pos, Action::RIGHT });
					}

					if (shell.at(7) == '0') actions.push_back(MoveAction{ pos, Action::DOWN });

					if (i < field.shells.size() - 1)
					{
						if (field.shells.at(i + 1).at(0) == '0') actions.push_back(MoveAction{ pos, Action::LEFT });
					}
				}

				if (j == 1)
				{
					if (shell.at(2) == '0') actions.push_back(MoveAction{ pos, Action::RIGHT });

					if (i == 0)
					{
						if (field.core == '0') actions.push_back(MoveAction{ pos, Action::DOWN_RIGHT });
					}
					else
					{
						if (field.shells.at(i - 1).at(1) == '0') actions.push_back(MoveAction{ pos, Action::DOWN_RIGHT });
					}

					if (shell.at(0) == '0') actions.push_back(MoveAction{ pos, Action::DOWN });

					if (i < field.shells.size() - 1)
					{
						if (field.shells.at(i + 1).at(1) == '0') actions.push_back(MoveAction{ pos, Action::UP_LEFT });
					}
				}

				if (j == 2)
				{
					if (shell.at(3) == '0') actions.push_back(MoveAction{ pos, Action::RIGHT });

					if (i == 0)
					{
						if (field.core == '0') actions.push_back(MoveAction{ pos, Action::DOWN });
					}
					else
					{
						if (field.shells.at(i - 1).at(2) == '0') actions.push_back(MoveAction{ pos, Action::DOWN });
					}

					if (shell.at(1) == '0') actions.push_back(MoveAction{ pos, Action::LEFT });

					if (i < field.shells.size() - 1)
					{
						if (field.shells.at(i + 1).at(2) == '0') actions.push_back(MoveAction{ pos, Action::UP });
					}
				}

				if (j == 3)
				{
					if (shell.at(4) == '0') actions.push_back(MoveAction{ pos, Action::DOWN });

					if (i == 0)
					{
						if (field.core == '0') actions.push_back(MoveAction{ pos, Action::DOWN_LEFT });
					}
					else
					{
						if (field.shells.at(i - 1).at(3) == '0') actions.push_back(MoveAction{ pos, Action::DOWN_LEFT });
					}

					if (shell.at(2) == '0') actions.push_back(MoveAction{ pos, Action::LEFT });

					if (i < field.shells.size() - 1)
					{
						if (field.shells.at(i + 1).at(3) == '0') actions.push_back(MoveAction{ pos, Action::UP_RIGHT });
					}
				}

				if (j == 4)
				{
					if (shell.at(5) == '0') actions.push_back(MoveAction{ pos, Action::DOWN });

					if (i == 0)
					{
						if (field.core == '0') actions.push_back(MoveAction{ pos, Action::LEFT });
					}
					else
					{
						if (field.shells.at(i - 1).at(4) == '0') actions.push_back(MoveAction{ pos, Action::LEFT });
					}

					if (shell.at(3) == '0') actions.push_back(MoveAction{ pos, Action::UP });

					if (i < field.shells.size() - 1)
					{
						if (field.shells.at(i + 1).at(4) == '0') actions.push_back(MoveAction{ pos, Action::RIGHT });
					}
				}

				if (j == 5)
				{
					if (shell.at(6) == '0') actions.push_back(MoveAction{ pos, Action::LEFT });

					if (i == 0)
					{
						if (field.core == '0') actions.push_back(MoveAction{ pos, Action::UP_LEFT });
					}
					else
					{
						if (field.shells.at(i - 1).at(5) == '0') actions.push_back(MoveAction{ pos, Action::UP_LEFT });
					}

					if (shell.at(4) == '0') actions.push_back(MoveAction{ pos, Action::UP });

					if (i < field.shells.size() - 1)
					{
						if (field.shells.at(i + 1).at(5) == '0') actions.push_back(MoveAction{ pos, Action::DOWN_RIGHT });
					}
				}

				if (j == 6)
				{
					if (shell.at(5) == '0') actions.push_back(MoveAction{ pos, Action::RIGHT });

					if (shell.at(7) == '0') actions.push_back(MoveAction{ pos, Action::LEFT });

					if (i == 0)
					{
						if (field.core == '0') actions.push_back(MoveAction{ pos, Action::UP });
					}
					else
					{
						if (field.shells.at(i - 1).at(6) == '0') actions.push_back(MoveAction{ pos, Action::UP });
					}

					if (i < field.shells.size() - 1)
					{
						if (field.shells.at(i + 1).at(6) == '0') actions.push_back(MoveAction{ pos, Action::DOWN });
					}
				}

				if (j == 7)
				{
					if (shell.at(6) == '0') actions.push_back(MoveAction{ pos, Action::RIGHT });

					if (shell.at(0) == '0') actions.push_back(MoveAction{ pos, Action::UP });

					if (i == 0)
					{
						if (field.core == '0') actions.push_back(MoveAction{ pos, Action::UP_RIGHT });
					}
					else
					{
						if (field.shells.at(i - 1).at(7) == '0') actions.push_back(MoveAction{ pos, Action::UP_RIGHT });
					}

					if (i < field.shells.size() - 1)
					{
						if (field.shells.at(i + 1).at(7) == '0') actions.push_back(MoveAction{ pos, Action::DOWN_LEFT });
					}
				}
			}
		}
	}

	return actions;
}

void Algorithm_Player::add_move_phase_state_actions()
{
	auto const states = this->get_states_for_distribution(StoneDistribution{ this->get_stones_left(), this->get_stones_left() });

	for (auto const& state : states)
	{
		auto const actions = this->get_move_actions_for_state(state);

		if (!this->q.count(state)) this->q[state] = std::map<std::any, int>();

		for (auto const& action : actions)
		{
			auto a = this->q[state];
			a[1] = 2;
			//if (this->check_if_state_is_goal(state, '1')) this->q[state][1] = this->random_q ? 0 : 1;
			//if (this->check_if_state_is_goal(state, '2')) this->q[state][1] = -1;
			//else this->q[state][action] = this->random_q ? rand() : 0;
		}
	}
}

void Algorithm_Player::init_q()
{
	this->add_place_phase_state_actions();
	this->add_move_phase_state_actions();
}
