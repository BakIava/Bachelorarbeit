#include "Shell.h"

Shell::Shell() {
	this->points = std::make_unique<std::vector<std::shared_ptr<Point>>>();
}