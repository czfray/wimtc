# 我架地鐵幾時嚟？When Is My Train Coming?

A simple, lightweight web application for checking real-time MTR and Light Rail train arrival information in Hong Kong.

**[Live Website](https://czfray.github.io/wimtc/)**

## Overview

我架地鐵幾時嚟？ is a web-based MTR and Light Rail arrival time checker designed to provide quick and convenient access to upcoming train information.

Simply select an MTR or Light Rail station to view the next trains across its supported lines, including their destinations and estimated arrival times.

## Features

- **Real-Time Train Arrivals** — Displays upcoming train arrival times using the MTR Next Train and Light Rail Next Train APIs.
- **MTR and Light Rail Support** — Supports both MTR and LRT services in Hong Kong.
- **Multiple Lines** — Automatically displays supported railway lines serving the selected station.
- **Bilingual Interface** — Station and line names in Traditional Chinese and English.
- **Automatic Refresh** — Updates arrival information every 5-10 seconds.
- **Remember Last Station** — Saves the user's last selected station using browser local storage.
- **Responsive Design** — Works on desktop and mobile browsers.
- **No Installation Required** — Runs directly in a web browser, with the option to add it to the home screen for quick access.

## How to Use

1. Visit the [website](https://czfray.github.io/wimtc/).
2. Choose between MTR and LRT services.
3. Select your station from the dropdown menu.
4. View the upcoming trains, grouped by railway line and destination.
5. Arrival information refreshes automatically.

### Arrival Time Indicators

| Indicator | Meaning |
|---|---|
| `0–99` | Estimated minutes until arrival |
| `Arr` | Train about to arrive at the station |
| `Stp` | Train stopped at the station, about to depart (LRT Only) |
| `Lft` | Train departed (LRT Only) |
| `-` | No arrival prediction available for that slot |

## Technologies

- HTML5
- CSS3
- JavaScript (Vanilla JS)
- MTR Next Train API
- MTR Light Rail Next Train API
- GitHub Pages

## Data Source

Train arrival information is provided by the **MTR Corporation** through the Hong Kong Government's open data platform.

### MTR

- [MTR Next Train API](https://rt.data.gov.hk/v1/transport/mtr/getSchedule.php)
- [MTR Next Train Data Dictionary (v1.7)](https://opendata.mtr.com.hk/doc/Next_Train_DataDictionary_v1.7.pdf)

### Light Rail

- [Light Rail Next Train API](https://rt.data.gov.hk/v1/transport/mtr/lrt/getSchedule)
- [Light Rail Next Train Data Dictionary (v1.2)](https://opendata.mtr.com.hk/doc/LR_Next_Train_DataDictionary_v1.2.pdf)

Train arrival predictions are subject to service conditions and data availability. Not all MTR or Light Rail services and stations may be supported by the APIs.

## Disclaimer

This is an independent, unofficial project and is not affiliated with or endorsed by MTR Corporation.

Arrival times are estimates provided by the MTR Next Train and Light Rail Next Train APIs and may change without notice. Always refer to official station announcements and displays for the latest service information.

## Author

Developed by Chan Ray.