#pragma once
#include <vector>
#include <math.h>
#include <bitset>
#include <map>
#include <any>
#include <cstdlib>
#include <regex>

#include "Field.h"
#include "IPlayer.h"
#include "Algorithm_Options.h"
#include "StoneDistribution.h"
#include "MoveAction.h"
#include "Stringified_Field.h"

class Algorithm_Player :
	public IPlayer
{
private:
	std::map<std::string, std::map<std::any, int>> q;
	double alpha;
	double epsilon;
	double gamma;
	double reward;
	bool random_q;

	Stringified_Field get_field(const std::string_view&) const;
	bool check_if_state_is_goal(const std::string&, char);
	std::vector<MoveAction> get_move_actions_for_state(const std::string&);
	std::vector<int> get_place_actions_for_state(const std::string&);
	std::vector<std::string> get_states_for_distribution(const StoneDistribution&);
	std::vector<StoneDistribution> calculate_stone_distributions();
	void add_place_phase_state_actions();
	void add_move_phase_state_actions();
	void init_q();

public:
	Algorithm_Player(const std::string&, int, const Algorithm_Options&);
	virtual ~Algorithm_Player() override = default;
};

