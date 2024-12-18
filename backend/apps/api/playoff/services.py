from math import ceil, log2

from .serializers import MatchSerializer, StageSerializer
from .models import Match, Stage


def create_groups(tournament_type):
    groups = [{"id": 0, "stage_id": 0, "number": 1}]
    if tournament_type == 'double_elimination':
        groups.append({"id": 1, "stage_id": 0, "number": 2})
    return groups


def calculate_round(size, tournament_type):
    rounds = []
    quantity = ceil(log2(size))
    ctr = 0
    for i in range(quantity):
        rounds.append(
            {
                "id": i,
                "number": i+1,
                "stage_id": 0,
                "group_id": 0,
            },
        )
        ctr = i
    if tournament_type == 'double_elimination':
        quantity = (quantity - 1) * 2
        for j in range(quantity):
            rounds.append(
                {
                    "id": j + ctr + 1,
                    "number": j+1,
                    "stage_id": 0,
                    "group_id": 1,
                },
            )
    return rounds


def create_matches(size, tournament_type, tournament):
    matches = []
    match_id = 0
    total_round = ceil(log2(size))
    stage = Stage.objects.get(tournament=tournament)
    for round_number in range(total_round):
        matches_in_round = size // (
            2 ** (round_number + 1))
        number = 1
        for _ in range(matches_in_round):
            opponent1 = {'id': None}
            opponent2 = {'id': None}
            match = Match.objects.create(
                stage_id=stage,
                round_id=round_number,
                group_id=0,
                number=number,
                opponent1=opponent1,
                opponent2=opponent2,
                status=1,
                child_count=0
            )
            match_serialized = MatchSerializer(match).data
            matches.append(match_serialized)

            match_id += 1
            number += 1

    if tournament_type == 'double_elimination':
        bottom_round = (ceil(log2(size)) - 1) * 2
        matches_in_round = int(size / 4)
        for round_number in range(1, bottom_round + 1):
            number = 1
            for _ in range(matches_in_round):
                opponent1 = {'id': None}
                opponent2 = {'id': None}
                match = Match.objects.create(
                    stage_id=stage,
                    round_id=round_number + total_round - 1,
                    group_id=1,
                    number=number,
                    opponent1=opponent1,
                    opponent2=opponent2,
                    status=1,
                    child_count=0
                )
                match_serialized = MatchSerializer(match).data
                matches.append(match_serialized)

                match_id += 1
                number += 1

            if round_number % 2 == 0:
                matches_in_round = int(matches_in_round / 2)
    return matches


def create_stage(size, tournament_type, tournament):
    Stage.objects.filter(tournament=tournament).delete()
    stage = Stage.objects.create(
        tournament=tournament,
        type=tournament_type,
        number=1,
        settings={"size": size, "seedOrdering": [
            "natural", "natural", "reverse_half_shift", "reverse"]}
    )
    stage_serialized = StageSerializer(stage).data
    return stage_serialized


def create_elimination_bracket(size, tournament_type, tournament):
    groups = create_groups(tournament_type)
    total_round = calculate_round(size, tournament_type)
    stage = create_stage(size, tournament_type, tournament)
    matches = create_matches(size, tournament_type, tournament)
    return {
        "groups": groups,
        "round": total_round,
        "matches": matches,
        "stage": [stage],
        "participant": [{}]
    }
