#pragma once
#include "Action.h"

struct MoveAction
{
public:
	short pos;
	Action action;

	MoveAction(short, Action);
	~MoveAction() = default;
};

