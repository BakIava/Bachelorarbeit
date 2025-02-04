#include "Algorithm_Options.h"

Algorithm_Options::Algorithm_Options(double alpha, double epsilon, double gamma, double reward, bool random_q)
	: alpha{ alpha }, epsilon{ epsilon }, gamma{ gamma }, reward{ reward }, random_q{ random_q } {}
