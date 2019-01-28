const root = document.body
let count = 0
const letters = 'abcdefghijklmnopqrstuvwxyz'
let guesses = {}
let word = []
let loaded = false
let guessesLeft = 0

const getWord = () =>
	m.request({ url: 'https://random-word-api.herokuapp.com/word?key=jecgaa&number=1' }).then((data) => {
		word = data[0].split('')
		guessesLeft = word.length - count
		loaded = true
	})

const eval = (letter) => {
	count++
	guessesLeft = word.length - count
	word.indexOf(letter) < 0 ? (guesses[letter] = 'f') : (guesses[letter] = 't')
}

const restart = () => {
	loaded = false
	guesses = {}
	count = 0
	getWord()
}

let blue = '#34495e'
let red = '#e74c3c'
let white = '#ecf0f1'
let grey = '#bdc3c7'

const letterState = (letter) => ({
	disabled: guesses[letter] == 't' || guesses[letter] == 'f',
	onclick: (e) => eval(letter),
	style: {
		width: '40px',
		height: '40px',
		borderRadius: '50%',
		margin: '4px',
		color: guesses[letter] ? (guesses[letter] == 'f' ? blue : grey) : white,
		'background-color': guesses[letter] ? (guesses[letter] == 't' ? white : red) : blue,
	},
})

const Header = {
	view: () =>
		m('header.header', { style: { textAlign: 'center' } }, [
			m('h1.title', 'HangMan'),
			m(
				'button.button',
				{
					style: {
						transform: guessesLeft == 0 ? 'scale(3)' : 'scale(1.5)',
						animate: '3s linear',
						weight: '400px',
					},
					onclick: () => restart(),
				},
				m.trust('&#x27F2')
			),
		]),
}

const Left = {
	view: () =>
		m(
			'div.column',
			{
				style: {
					flex: '50%',
					padding: '0px 50px',
				},
			},
			[
				m('h1.title', `GUESSES LEFT ${guessesLeft}`),
				m(
					'.',
					{
						style: {
							minWidth: '40%',
						},
					},
					letters.split('').map((letter) => m('button.button', letterState(letter), letter.toUpperCase()))
				),
			]
		),
}

const Right = {
	oninit: getWord(),
	view: () =>
		m(
			'div.column',
			{
				style: {
					flex: '50%',
					padding: '0px 50px',
				},
			},
			[
				m('h1.title', 'RESULT'),
				loaded
					? [
							m(
								'.',
								word.map((l) => m('span.span', { style: { 'font-size': '30px', margin: '6px' } }, guesses[l] ? l : '_'))
							),
							m(
								'.',
								Object.entries(guesses).map(([ letter, value ]) =>
									m('del.del', { style: { 'font-size': '30px' } }, value == 't' ? '' : letter)
								)
							),
						]
					: '',
			]
		),
}

const Body = {
	view: () =>
		m(
			'section.columns',
			{
				style: {
					padding: '50px 50px',
					display: 'flex',
				},
			},
			[
				m(Left),
				m(Right),
				guessesLeft == 0
					? m(
							'aside',
							{
								oncreate: ({ dom }) =>
									dom.animate(
										[
											{
												backgroundPosition: '0%50%',
												opacity: 0,
											},
											{
												backgroundPosition: '0%50%',
												opacity: 1,
											},
										],
										{
											duration: 150,
										}
									),
								style: {
									transform: 'rotate(-15deg)',
									color: white,
									fontSize: '4rem',
									position: 'absolute',
									height: '200px',
									width: '500px',
									background: blue,
									left: '25%',
									padding: '30px',
									zIndex: '10000',
								},
							},
							`The correct word is: ${word.join('')}`
						)
					: '',
			]
		),
}

const HangMan = {
	view: () => m('.container', [ m(Header), m(Body) ]),
}

m.mount(root, HangMan)
