#pragma once
#include <memory>

#include "IPlayer.h"

struct Stone
{
public:
	Stone();
	Stone(std::unique_ptr<IPlayer>&);
	~Stone() = default;

	std::unique_ptr<IPlayer> player = nullptr;
};

