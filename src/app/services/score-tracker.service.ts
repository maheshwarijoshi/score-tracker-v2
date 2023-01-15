import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class ScoreTrackerService {
  _apiBaseUrl: string = 'https://free-nba.p.rapidapi.com/';
  constructor(private http: HttpClient) {}

  createAuthorizationHeader(): HttpHeaders {
    const headerDict = {
      'X-RapidAPI-Key': '2QMXSehDLSmshDmRQcKUIAiQjIZAp1UvKUrjsnewgqSP6F5oBX',
      'X-RapidAPI-Host': 'free-nba.p.rapidapi.com',
    };
    return new HttpHeaders(headerDict);
  }

  getTeamsList() {
    return this.http.get(`${this._apiBaseUrl}teams`, {
      headers: this.createAuthorizationHeader(),
    });
  }

  getSelectedTeamInformation(teamId: number) {
    return this.http.get(
      `${this._apiBaseUrl}games?page=0&dates[]=2022-05-06&dates[]=2022-04-05&dates[]=2022-03-04&per_page=12&team_ids[]=${teamId}`,
      {
        headers: this.createAuthorizationHeader(),
      }
    );
  }

  setDataIntoStore(stockDisplayList) {
    localStorage.setItem('scoreTrackerData', JSON.stringify(stockDisplayList));
  }
}
