#pragma once
#include <restbed>
#include <memory>
#include <string>
#include <nlohmann/json.hpp>

#include "Game.h"
#include "IPlayer.h"
#include "Algorithm_Player.h"

class Server
{
private:
	unsigned short port = 0;

	static void start_train(const std::shared_ptr<restbed::Session>);
public:
	Server(unsigned short);
	void start() const;
};

