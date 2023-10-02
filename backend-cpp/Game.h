#pragma once
#include <memory>

#include "Field.h"
#include "IPlayer.h"

class Game
{
private:
	std::unique_ptr<Field> field;
	std::shared_ptr<IPlayer> p1;
	std::shared_ptr<IPlayer> p2;
	bool place_core_allowed = false;
public:

	Game(const std::shared_ptr<IPlayer>&, const std::shared_ptr<IPlayer>&, short, bool);
};

