#include "Server.h"

using json = nlohmann::json;

Server::Server(unsigned short port) : port{ port } { }

void Server::start_train(const std::shared_ptr<restbed::Session> session) {
	const auto request = session->get_request();

	size_t content_length = request->get_header("Content-Length", 0);

	session->fetch(content_length, [request](const std::shared_ptr<restbed::Session> session, const restbed::Bytes& body)
		{
			auto parsed_body = std::string((char*)body.data(), body.size());

			json data = json::parse(parsed_body);
			auto shells = data["options"]["shells"].template get<short>();
			auto episodes = data["options"]["episodes"].template get<int>();
			auto player_1 = data["p1"]["player"].template get<int>();
			auto player_2 = data["p2"]["player"].template get<int>();

			// Error Handling
			auto options = Algorithm_Options();
			auto p1 = std::make_shared<Algorithm_Player>("player-1", shells, options);
			auto p2 = std::make_shared<IPlayer>("player-2", shells);

			Game g{ p1,p2, shells, false };


			session->close(restbed::OK, "Hello, World!", { { "Content-Length", "13" }, { "Connection", "close" } });
		});
}

void Server::start() const {
	auto resource = std::make_shared<restbed::Resource>();
	resource->set_method_handler("POST", Server::start_train);
	resource->set_path("/train");

	auto settings = std::make_shared<restbed::Settings>();
	settings->set_port(this->port);
	settings->set_default_header("Connection", "close");

	restbed::Service service;
	service.publish(resource);
	service.start(settings);
}