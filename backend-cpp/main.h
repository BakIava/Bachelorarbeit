#include <memory>
#include <cstdlib>
#include <restbed>
#include <nlohmann/json.hpp>
#include <iostream>

using namespace std;
using namespace restbed;
using json = nlohmann::json;


void get_method_handler(const shared_ptr<Session> session)
{
	session->close(OK, "Hello, World!", { { "Content-Length", "13" } });
}

void start_train(const shared_ptr<Session> session) 
{
	const auto request = session->get_request();

	size_t content_length = request->get_header("Content-Length", 0);

	session->fetch(content_length, [request](const shared_ptr<Session> session, const Bytes& body)
	{
		fprintf(stdout, "%.*s\n", (int)body.size(), body.data());
		string bodyString = std::string((char*)body.data(), body.size());
		json data = json::parse(bodyString);
		string test = data.
		session->close(OK, "Hello, World!", { { "Content-Length", "13" }, { "Connection", "close" } });
	});
}

int main(const int, const char**)
{
	auto resource = make_shared< Resource >();
	resource->set_path("/resource");
	resource->set_method_handler("GET", get_method_handler);
	resource->set_method_handler("POST", start_train);

	auto settings = make_shared< Settings >();
	settings->set_port(1984);
	settings->set_default_header("Connection", "close");

	Service service;
	service.publish(resource);
	service.start(settings);

	return EXIT_SUCCESS;
}