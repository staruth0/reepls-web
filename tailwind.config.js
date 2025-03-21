/** @type {import('tailwindcss').Config} */
export default {
  content: ['./pages/**/*.{html,js,ts,tsx}', './components/**/*.{html,js,ts,tsx}', './src/**/*.{html,js,ts,tsx}'],
  // theme: {
  //   extend: {
  //     colors: {
  //       primary: {
  //         50: '#f9fff5',
  //         100: '#f2ffeb',
  //         200: '#aefd7d',
  //         300: '#7ef038',
  //         400: '#57c016',
  //         500: '#408415',
  //         600: '#aefd7d',
  //         700: '#effff5',
  //         800: '#f9fff5',
  //       },
  //       secondary: {
  //         50: '#534109',
  //         100: '#796215',
  //         200: '#ae8a13',
  //         300: '#e9b50c',
  //         400: '#ffcd29',
  //         500: '#ffd95c',
  //         600: '#ffe58f',
  //         700: '#fffc12',
  //         800: '#fff5d6',
  //       },
  //       neutral: {
  //         50: '#474747',
  //         100: '#737373',
  //         200: '#9E9E9E',
  //         300: '#B3B3B3',
  //         400: '#CCCCCC',
  //         500: '#DEDEDE',
  //         600: '#F2F2F2',
  //         700: '#F7F7F7',
  //         800: '#FCFCFC',
  //       },
  //       main: {
  //         green: '#57c016',
  //         yellow: '#e9b50c',
  //       },
  //       background: '#fefefe',
  //       plain: {
  //         a: '#242424',
  //         b: '#fefefe',
  //       },
  //     },
  //     fontFamily: {
  //       roboto: ['Roboto', 'sans-serif'],
  //       inter: ['Inter', 'sans-serif'],
  //       instrumentSerif: ['Instrument Serif', 'serif'],
  //     },
  //   },
  // },
  plugins: [
    // require('@tailwindcss/typography'),
    // require('@tailwindcss/forms'),
    // require('@tailwindcss/aspect-ratio'),
    // require('@tailwindcss/container-queries'),
    require('tailwindcss-themer')({
      defaultTheme: {
        extend: {
          colors: {
            primary: {
              50: '#f9fff5', // No change
              100: '#f2ffeb', // No change
              200: '#294517', // No change
              300: '#469117', // Changed from #7ef038
              400: '#57c016', // No change
              500: '#7ef038', // Changed from #408415
              600: '#aefd7d', // No change
              700: '#ecffe1', // Changed from #effff5
              800: '#f9fff5',
            },
            secondary: {
              50: '#534109', // No change
              100: '#796215', // No change
              200: '#c49b12', // Changed from #ae8a13
              300: '#e9b50c', // No change
              400: '#ffcd29', // No change
              500: '#ffd95c', // No change
              600: '#ffe58f', // No change
              700: '#fffc12', // No change
              800: '#fff5d6',
            },
            neutral: {
              50: '#333333', // No change
              100: '#737373', // No change
              200: '#868686', // Changed from #9E9E9E
              300: '#838383', // Changed from #B3B3B3
              400: '#cccccc', // Changed from #CCCCCC (same value, case normalized)
              500: '#dedede', // Changed from #DEDEDE (same value, case normalized)
              600: '#f2f2f2', // Changed from #F2F2F2 (same value, case normalized)
              700: '#f7f7f7', // Changed from #F7F7F7 (same value, case normalized)
              800: '#fcfcfc',
            },
            main: {
              green: '#57c016',
              yellow: '#e9b50c',
            },
            background: '#fefefe',
            foreground: '#1f1f1f',
            // background: '#fefefe',
            plain: {
              a: '#242424',
              b: '#fefefe',
            },
          },
        },
      },
      themes: [
        {
          name: 'dark-theme',
          extend: {
            colors: {
              primary: {
                50: '#141712', // No change
                100: '#161813', // Changed from #161b13
                200: '#AEFD7D', // No change
                300: '#375c1f', // No change
                400: '#408415', // No change
                500: '#34581d', // No change
                600: '#182112', // No change
                700: '#25371b', // Changed from #0f0f0f
                800: '#1e221b',
              },
              secondary: {
                50: '#ffffff', // Changed from #ffffff (but your comment says #534109?)
                100: '#796215', // Changed from #fff1c2
                200: '#d5a710', // Changed from #ffe58f
                300: '#e9b50c', // No change
                400: '#ffcd29', // No change
                500: '#ffd95c', // No change
                600: '#aeba13', // Changed from #ae8a13
                700: '#534109', // Changed from #534109 (your comment conflicts)
                800: '#ffffff',
              },
              neutral: {
                50: '#e1e1e1', // Changed from #474747
                100: '#c4c3c3', // Changed from #9E9E9E
                200: '#7a7a7a', // No change
                300: '#707070', // No change
                400: '#5c5c5c', // No change
                500: '#414141', // Changed from #333333
                600: '#303030', // No change
                700: '#262626', // No change
                800: '#212121',
              },
              main: {
                green: '#408415',
                yellow: '#ffcd29',
              },
              background: '#1f1f1f',
              foreground: '#fefefe',
              // background: '#0f0f0f',
              plain: {
                a: '#e0e0e0',
                b: '#141414',
              },
            },
          },
        },
      ],
    }),
  ],
};
