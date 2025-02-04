#include "Server.h"

int main()
{
	auto server = std::make_unique<Server>(1998);
	server->start();

	return EXIT_SUCCESS;
}