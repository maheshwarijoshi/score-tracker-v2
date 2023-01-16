import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import {
  SelctedTeam,
  SelectedTeamInfo,
  Team,
} from '../../models/score-tracker';
import { ScoreTrackerService } from '../../services/score-tracker.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-team-results',
  templateUrl: './team-results.component.html',
  styleUrls: ['./team-results.component.css'],
})
export class TeamResultsComponent implements OnInit, OnDestroy {
  subscription: Subscription = new Subscription();
  hasLoading: boolean = false;
  selectedTeamInfo: SelctedTeam[] = [];
  selectedTeam: Team;
  constructor(
    private readonly scoreTrackerService: ScoreTrackerService,
    private readonly activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const id = this.activatedRoute.snapshot.params;
    this.getTeamInfo(id);
  }

  getTeamInfo(id): void {
    const payLoad = Number(Object.values(id)[0]);
    this.hasLoading = true;
    const getSelectedTeamInformation$ =
      this.scoreTrackerService.getSelectedTeamInformation(payLoad);
    getSelectedTeamInformation$
      .pipe(
        map((response: SelectedTeamInfo) => {
          const teamInfo = response.data.filter(
            (element: SelctedTeam) =>
              element.home_team.id === payLoad ||
              element.visitor_team.id === payLoad
          );
          this.selectedTeamInfo = response.data;
          this.hasLoading = false;
          this.selectedTeam = {
            team_name: this.setTeamData(teamInfo[0], 'full_name', payLoad),
            team_abbreviation: this.setTeamData(
              teamInfo[0],
              'abbreviation',
              payLoad
            ),
            team_conference: this.setTeamData(
              teamInfo[0],
              'conference',
              payLoad
            ),
            team_division: this.setTeamData(teamInfo[0], 'division', payLoad),
          };
        })
      )
      .subscribe();
  }

  setTeamData(team, key, id): string {
    return team.home_team.id === id
      ? team.home_team[key]
      : team.visitor_team[key];
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
