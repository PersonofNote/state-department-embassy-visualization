import * as d3 from 'd3';
import mapdata from './mapdata.js';

export default function () {
  document.addEventListener('DOMContentLoaded', () => {
    const filePath = d3.select('.wp-block-file').select('a').attr('href');
    d3.select('.modal-button')
      .on('click', toggleModal);

    function toggleModal() {
      const modal = d3.select('#legation-modal');
      console.log(modal.classed('active'))
      return modal.classed('active') ? modal.classed('active', false) : modal.classed('active', true);
    }

    const container = d3.select('#map-container');
    const worldMapSvg = d3.select('#worldMap');

    let width = parseInt(container.style('width'));
    let height = parseInt(container.style('height'));

    const mapGroup = d3.select('#mapGroup')
      .attr('class', 'paths'); // appended first so dots are drawn on top rather than behind
    const dotsGroup = worldMapSvg.append('g')
      .attr('class', 'dots-group');
    const tooltip = d3.select('body').append('div')
      .attr('class', 'tooltip')
      .style('opacity', 0);

    const projection = d3.geoMercator()
      .center([0, 35])
      .scale(120);

    const svgDefs = d3.select('defs');
    const dotGradient = svgDefs.append('radialGradient')
      .attr('id', 'dotGradient');

    // Create the stops of the main gradient. Each stop will be assigned
    // a class to style the stop using CSS.
    dotGradient.append('stop')
      .attr('class', 'stop-center')
      .attr('offset', '0');

    dotGradient.append('stop')
      .attr('class', 'stop-outer')
      .attr('offset', '1');

    const playIcons = document.getElementsByClassName('icon-controls');
    const playButton = document.getElementById('play-button');
    playButton.addEventListener('click', togglePlay);
    const timeline = document.getElementById('timeline');
    const timelineContainer = document.getElementById('timeline-container');
    timelineContainer.style.width = '80%';
    timeline.style.width = '100%';

    function setTimelineTooltip(range, display, year) {
      const ratio = (range.value - range.min) / (range.max - range.min);
      display.html(year)
        .style('left', `calc(${ratio} * 100% - ${ratio})px`)
        .style('top', `${timeline.pageY - 28}px`);
    }

    /**
   * Initialize animation variables
   * */
    let frame = 0;
    const startYear = 1776;
    let displayYear = startYear;
    let interval;
    let countdown;
    let restart;
    const speed = 100; // ms TODO: Add variable speed to playback
    let playing = false;
    const thisYear = new Date().getFullYear();

    timeline.oninput = function () {
      pause();
      clearAll();
      onRestart();
      displayYear = this.value;
      d3.selectAll('.year-display').text(displayYear);
      setTimelineTooltip(timeline, tooltip, displayYear);
      frame = this.value - startYear;
      for (let i = 0; i < (this.value - startYear); i++) { updateDots(i + startYear); }
    };

    function drawMap(data) {
      mapGroup.selectAll('path')
        .data(data.features)
        .enter()
        .append('path')
        .attr('class', 'landpath')
        .attr('id', data.features.name)
        .attr('d', d3.geoPath()
          .projection(projection));
      initializeDots();
    }


    function initializeDots() {
      d3.csv(filePath).then((dataset) => {
        const countryList = [];
        dataset.forEach((d) => {
          rows.push(d);
          addDotTomap(d);
          if (!countryList.includes(d.country)) {
            countryList.push(`${d.country} ${d.event}`);
          }
        });
        fillTimeline();
      });
    }

    function populateLegend(dataset) {
      const legend = d3.select('.legend-info');
      legend.selectAll('.legend-span').remove();
      legend
        .append('div')
        .attr('class', 'legend-span')
        .attr('id', (d) => d)
        .text(dataset.join(', '))
        .style('opacity', 1);
    }


    function fillTimeline() {
      const years = document.getElementById('yearsList');
      for (let i = 0; i < ((thisYear - startYear) + 1); i++) {
        const value = i + startYear;
        const year = document.createElement('option');
        // year.width = ((timeline.clientWidth / 244) * 0.5);
        year.width = '0';
        year.value = value;
        if (value === startYear || value % 25 === 0 || value === 2020) {
          year.label = year.value;
        }
        years.appendChild(year);
      }
      d3.select('#timeline').on('mouseover', (d) => {
        tooltip.transition()
          .duration(200)
          .style('opacity', 0.9);
        tooltip.html(displayYear)
          .style('left', `${d3.event.pageX}px`)
          .style('top', `${d3.event.pageY - 28}px`);
      })
        .on('mouseout', (d) => {
          tooltip.transition()
            .duration(500)
            .style('opacity', 0);
        });
    }

    function addDotTomap(d) {
      dotsGroup.selectAll('circle')
        .data(rows).enter()
        .append('circle')
        .attr('class', `dot dot-${d.year} ${d.country}`)
        .attr('data-event', d.event)
        .attr('data-country', d.country)
        .attr('cx', (d) => projection([d.lon, d.lat])[0])
        .attr('cy', (d) => projection([d.lon, d.lat])[1])
        .attr('r', '2px')
        .attr('opacity', 0)
        .attr('stroke', 0)
        .attr('fill', 'url(#dotgradient)');
    }


    function updateDots(year) {
      const countryList = [];
      const selectDots = worldMapSvg.selectAll(`.dot-${year}`);
      // Set all dots for the year to 0 opacity
      selectDots.each(function () {
        const targetDot = worldMapSvg.selectAll(`.${this.dataset.country}`);
        targetDot
          .transition()
          .attr('opacity', 0)
          .duration(500);
        countryList.push(`${this.dataset.country} ${this.dataset.event}`);
      });
      populateLegend(countryList);
      // Change bubble opacity to one if year matches
      selectDots
        .transition()
        .attr('stroke', 0)
        .delay((d, i) => 1.1 * i) // Add a slight stagger to the dot appearance
        .ease(d3.easeBackOut)
        .duration(500)
        .attr('r', (d) => {
          if (d.event.includes('legation')) {
            return '6px';
          } if (d.event.includes('embassy')) {
            return '8px';
          } if (d.event.includes('closure')) {
            return '1px';
          }
        })
        .attr('opacity', (d) => {
          if (d.event.includes('legation')) {
            return 0.8;
          } if (d.event.includes('embassy')) {
            return 1;
          } if (d.event.includes('closure')) {
            return 0;
          }
        });
      selectDots
        .on('mouseover', (d) => {
          tooltip.transition()
            .duration(200)
            .style('opacity', d.event.includes('legation') || d.event.includes('embassy') ? 0.9 : 0);
          tooltip.html(d.country)
            .style('left', `${d3.event.pageX + 12}px`)
            .style('top', `${d3.event.pageY - 28}px`);
        })
        .on('mouseout',
          tooltip.transition()
            .duration(500)
            .style('opacity', 0));
    }

    function pause() {
      onRestart();
      if (playing === true) {
        playing = false;
        clearInterval(interval);
        swapIcons();
        d3.selectAll('.legend-span')
          .style('opacity', 1);
        d3.selectAll('.legend-mask')
          .transition(200)
          .style('opacity', 0);
      }
    }


    function clearAll() {
      frame = 0;
      worldMapSvg.selectAll('circle')
        .transition()
        .attr('opacity', 0);
    }

    // Controls restarting from the pause at the end
    function onRestart() {
      d3.selectAll('.icon-controls').style('opacity', 1);
      clearInterval(countdown);
      clearTimeout(restart);
      countdown = undefined;
      d3.selectAll('#play-button').selectAll('svg').select('#countdown').text('');
      d3.selectAll('#icon-countdown-circle').style('stroke-dashoffset', 76);
    }

    function swapIcons() {
      for (const icon of playIcons) {
        icon.classList.toggle('visible');
      }
    }


    /**
   * Start/stop playback
   * */

    function togglePlay() {
      onRestart();
      if (playing === true) {
        playing = false;
        clearInterval(interval);
        d3.selectAll('.legend-span')
          .style('opacity', 1);
        d3.selectAll('.legend-mask')
          .style('opacity', 0);
      } else if (playing === false) {
        interval = setInterval(() => {
          frame++;
          updateDots(displayYear);
          displayYear = frame + startYear;
          timeline.value = displayYear;
          d3.selectAll('.year-display').text(displayYear);
          // Pause before restarting
          if (displayYear >= thisYear) {
            pause();
            clearAll();
            let counter = 9;
            d3.selectAll('.icon-controls').style('opacity', 0);
            const countCircle = d3.selectAll('#icon-countdown-circle');
            countCircle.style('stroke-dashoffset', 0);
            const countdownText = d3.selectAll('#play-button').selectAll('svg').select('#countdown');
            countdownText.attr('x', '30%');
            countdownText.text(10);
            countdown = setInterval(() => {
              countCircle.style('stroke-dashoffset', 76 - ((0.76 * counter) * 10));
              countdownText.attr('x', '40%');
              countdownText.text(counter);
              counter --;
            }, 1000);
            restart = setTimeout(togglePlay, 10000);
          }
        }, speed);
        d3.selectAll('.legend-span')
          .style('opacity', 1);
        d3.selectAll('.legend-mask')
          .transition(200)
          .style('opacity', 1);
        playing = true;
      }
      swapIcons();
    }

    drawMap(mapdata);
  });
}
