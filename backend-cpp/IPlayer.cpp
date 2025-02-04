#include "IPlayer.h"

IPlayer::IPlayer(const std::string& name, int shells) {
	if (shells > 3) throw std::string {"shell cannot be bigger than 3"};

	this->name = name;
	this->shells = shells;
	this->score = 0;
	this->stones = this->shells * 2 + 1;
}

void IPlayer::won() { 
	this->score++;
}

void IPlayer::place_stone() {
	if (this->stones == 0) return;
	this->stones--;
}


void IPlayer::reset_stones() {
	this->stones = this->shells * 2 + 1;
}

std::string IPlayer::get_name() {
	return this->name;
}

int IPlayer::get_score() {
	return this->score;
}

int IPlayer::get_stones_left() {
	return this->stones;
}

short IPlayer::get_shell_count() {
	return this->shells;
}
