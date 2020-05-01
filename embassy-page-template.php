<?php
/**
 * Template Name: Embassy Page Template
 *
 * 
 *
 * @package WordPress
 */

get_header();
?>

<section id="primary" class="content-area">
	<main id="main" class="site-main">
		<div id="diplomacy-plugin-wrapper">
			<?php
			/* Start the Loop */
            while ( have_posts() ) : ?>
			<div class="embassy-title-header">
				<div class="embassy-title-content">
					<h1> <?php the_title(); ?> </h1>
					<h3> U.S. Embassies and Legations 1778-2020 </h3>
				</div>
			</div>
			<?php	
					the_post();

					the_content();


				endwhile; // End of the loop.
				?>
			<div id="map-container">
				<div class="svg-and-controls-container">
				<button class="modal-button"> What is a legation? </button>
				<div id="legation-modal" class="modal"> A legation was a diplomatic foreign mission headed by a diplomat with the rank of minister.  
				In the 20th century as the United States expanded its global influence, legations became embassies headed by ambassadors, a higher rank than minister.  
				The last remaining American <b>legations</b>, in Bulgaria and Hungary, were elevated to <b>embassies</b> in 1966.
				</div>
					<svg id="worldMap" viewbox="250 50 450 475">
						<defs>
							<linearGradient id="bluegradient" x1="0%" y1="0%" x2="0%" y2="100%"
								gradientUnits="userSpaceOnUse">
								<stop offset="0%" style="stop-color:#6dbbdc;stop-opacity:1" />
								<stop offset="100%" style="stop-color:#3781a5;stop-opacity:1" />
							</linearGradient>
							<radialGradient id="dotgradient" cx="50%" cy="50%" r="70%">
								<!-- Animation for radius of gradient -->
								<animate attributeName="r" values="0%;150%;100%" dur="3s" repeatCount=1 />
								<!-- Animation for colors of stop-color -->
								<stop stop-color="#FBD958" offset="0">
									<animate attributeName="stop-color" values="#FBD958;#FBD958;#FBD958"
										dur="3s" repeatCount= 1 />
								</stop>
								<stop stop-color="rgba(55,55,55,0)" offset="100%" />
							</radialGradient>
							<radialGradient id = "g1" cx = "50%" cy = "50%" r = "50%">
								<animate attributeName="r" values="0%;150%;100%" dur="3s" repeatCount=1 />
								<stop stop-color = "#FBD958" offset = "0%"/>
								<stop stop-color = "rgba(251,217,88,0.8)" offset = "50%"/>
								<stop stop-color = "rgba(55,55,55,0)" offset = "100%"/>
							</radialGradient>
						</defs>
						<g id='mapGroup' fill="url(#bluegradient)" stroke="url(#bluegradient)"></g>
					</svg>

					<div class="event-container"></div>
					<section class="controls">
						<div class='play-container'>
						<div id="play-button" role="button" class="play-button">
							<svg id="play-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 26 26">
								<path class="icon-circle"
									d="M26,13A13,13,0,1,1,13,0,13,13,0,0,1,26,13ZM13,2.18A10.89,10.89,0,1,0,23.84,13.06,10.89,10.89,0,0,0,13,2.18Z" />
								<circle id="icon-countdown-circle" class="icon-circle" cx="50%" cy="50%" r="12"  fill="none" stroke="#FF5C56" stroke-width=2> </circle>
									<!--<path style="stroke-dasharray: 5; stroke-dashoffset:100"  fill="none" stroke="red" stroke-width=3
									d="M26,13A13,13,0,1,1,13,0,13,13,0,0,1,26,13ZM13,2.18A10.89,10.89,0,1,0,23.84,13.06,10.89,10.89,0,0,0,13,2.18Z" />-->
								<polygon id="icon-play" class="icon-controls visible"
									points="9.33 6.69 9.33 19.39 19.3 13.04 9.33 6.69" />
								<path id="icon-pause" class="icon-controls"
									d="M 7 6 L 13 6 L 13 20 L 7 20 M 14 6 L 20 6 L 20 20 L 14 20"></path>
								<text font-weight="bold" font-size="10" x="40%" y="65%" id='countdown'> </text>
							</svg>
						</div>
						</div>
						<div id="timeline-container" class="timeline-container">
							<input id="timeline" type="range" min="1776" max="2020" step="1" list="yearsList" />
							<!-- <output name="year"></output> -->
							<output for="timeline" onforminput="value = timeline.valueAsNumber;"></output>
							<datalist id="yearsList"> </datalist>
						</div>
					</section>
				</div>
				<section class="secondary-container">
					<div class="info">
						<div class="map-legend-container">
							<div class="legend-header">
								<h2> Change in U.S. Diplomatic Mission Status</h2>
								<div class="year-display"> 1983 </div>
							</div>
							<div class="legend-info">
								<div class="legend-mask"> </div>
							</div>
						</div> 
					</div>
				</section>
			</div>
		</div>
	</main><!-- #main -->
</section><!-- #primary -->

<?php
get_footer();
?>