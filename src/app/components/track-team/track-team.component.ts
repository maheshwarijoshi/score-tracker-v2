import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  TeamsList,
  AllTeamsList,
  SelctedTeam,
  SelectedTeamInfo,
} from '../../models/score-tracker';
import { ScoreTrackerService } from '../../services/score-tracker.service';

@Component({
  selector: 'app-track-team',
  templateUrl: './track-team.component.html',
  styleUrls: ['./track-team.component.css'],
})
export class TrackTeamComponent implements OnInit, OnDestroy {
  scoreTrackerFormGroup: FormGroup;
  teamsList: TeamsList[] = [];
  selectedTeamInfo: SelctedTeam[] = [];
  teamLogoUrl: string = 'https://interstate21.com/nba-logos/';
  loading: boolean = false;
  subscription: Subscription = new Subscription();

  constructor(private readonly scoreTrackerService: ScoreTrackerService) {}

  ngOnInit(): void {
    this.getInititalData();
    this.createForm();
    this.getTeamsList();
  }

  createForm(): void {
    this.scoreTrackerFormGroup = new FormGroup({
      teamName: new FormControl('', [Validators.required]),
    });
  }

  getTeamsList(): void {
    this.loading = true;
    const getTeams$ = this.scoreTrackerService.getTeamsList();
    getTeams$
      .pipe(
        map((response: AllTeamsList) => {
          this.teamsList = response.data;
          this.loading = false;
        })
      )
      .subscribe();
  }

  submit(): void {
    this.trackTeams();
  }

  trackTeams(): void {
    this.loading = true;
    const { teamName } = this.scoreTrackerFormGroup.value;
    const getSelectedTeamInformation$ =
      this.scoreTrackerService.getSelectedTeamInformation(teamName);
    getSelectedTeamInformation$
      .pipe(
        map((response: SelectedTeamInfo) => {
          const selectedTeam = {
            ...response.data[0],
            team_logo: `${this.teamLogoUrl}${response.data[0].home_team.abbreviation}.png`,
          };
          this.selectedTeamInfo.push(selectedTeam);
          this.loading = false;
          localStorage.setItem(
            'scoreTrackerData',
            JSON.stringify(this.selectedTeamInfo)
          );
        })
      )
      .subscribe();
  }

  getInititalData(): void {
    const selectedTeamInfo = localStorage.getItem('scoreTrackerData');
    this.selectedTeamInfo = selectedTeamInfo
      ? JSON.parse(selectedTeamInfo)
      : [];
  }

  removeTeam(indx: number): void {
    this.selectedTeamInfo.splice(indx, 1);
    localStorage.setItem(
      'scoreTrackerData',
      JSON.stringify(this.selectedTeamInfo)
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
