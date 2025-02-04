#pragma once
#include <vector>
#include <memory>

#include "Point.h"
struct Shell
{
public: 
	Shell();
	~Shell() = default;

	std::unique_ptr<std::vector<std::shared_ptr<Point>>> points;
};

