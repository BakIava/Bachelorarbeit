#include "Game.h"
#include "Action.h"

Game::Game(const std::shared_ptr<IPlayer>& p1, const std::shared_ptr<IPlayer>& p2, short shell_count, bool place_core_allowed) :
	p1{ p1 },
	p2{ p2 },
	place_core_allowed{ place_core_allowed }
{
	this->field = std::make_unique<Field>(shell_count);
}