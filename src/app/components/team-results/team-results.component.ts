import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { SelctedTeam, SelectedTeamInfo } from '../../models/score-tracker';
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
  constructor(
    private readonly scoreTrackerService: ScoreTrackerService,
    private readonly activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params) => {
      console.log(params);
      this.getTeamInfo(params.teamCode || 24);
    });
  }

  getTeamInfo(id): void {
    this.hasLoading = true;
    const getSelectedTeamInformation$ =
      this.scoreTrackerService.getSelectedTeamInformation(id);
    getSelectedTeamInformation$
      .pipe(
        map((response: SelectedTeamInfo) => {
          this.selectedTeamInfo = response.data;
          this.hasLoading = false;
        })
      )
      .subscribe();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
