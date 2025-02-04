#pragma once
#include <string>
class IPlayer
{
private:
	std::string name = "Undefined";
	int score = 0;
	int stones = 0;
	short shells = 0;
public:
	IPlayer() = default;
	IPlayer(const std::string&, int);
	virtual ~IPlayer() = default;

	void won();
	void place_stone();
	void reset_stones();
	std::string get_name();
	int get_score();
	int get_stones_left();
	short get_shell_count();
	/*virtual void choose_place_action(IField) = 0;
	virtual void choose_move_action(IField) = 0;*/

};

