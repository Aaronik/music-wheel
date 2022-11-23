import './Instructions.css'

type InstructionsProps = {
  isOpen: boolean
  close: () => void
}

export default function Instructions({ isOpen, close }: InstructionsProps) {
  let className = "modal"
  if (!isOpen) className += " hidden"

  return (
    <div onClick={close} id="instructions" className={className}>
      <h1>How to use Music Theory Mode Wheel</h1>
      <hr />
      <br />
      <p>
        Rotate the outer wheel so that the letter of the desired key aligns with the 'Root'
        position. By looking into the outermost ring of the chart each note's Interval
        relationship with the Root note is illuminated.
      </p>
      <p>
        A shorthand is used for each of the interval names:
        Root corresponds to the root note or Unison and Octave
        m2 is the Minor Second, or Half Step<br />
        M2 is the Major Second, or Whole Step<br />
        m3 is the Minor Third<br />
        M3 is the Major Third<br />
        4 is the Fourth sometimes known as 'Perfect Fourth'<br />
        Tritone is the augmented fourth or diminished fifth<br />
        5 is the Fifth or 'Perfect Fifth'<br />
        m6 is the Minor Sixth<br />
        M6 is the Major Sixth<br />
        m7 is the minor seventh<br />
        and M7 is the Major Seventh.
      </p>
      <p>
        Next Rotate the inner wheel so that the color of the desired mode aligns with the
        chosen Root note. By following the colored spokes clockwise, as they point to their
        respective notes, the chosen mode will be spelled.
        There are 7 modes which each correspond to a color, they are:<br />
        <span className="red">Ionian</span> Red, for most practical purposes Ionian is synonymous
        with the Major Scale. <span className="orange">Dorian</span> Orange.
        &nbsp;<span className="yellow">Phrygian</span> Yellow. <span className="green">Lydian</span>
        &nbsp;Green. <span className="blue">MixoLydian</span> Blue. <span className="indigo">Aeolian</span>
        &nbsp;Indigo, for most purposes Aeolian is synonymous with the Natural Minor Scale.
        &nbsp;<span className="violet">Locrian</span> Violet.
      </p>
      <p>
        Next to each of the modes ia a Roman numeral. An upper case Roman numeral represents a
        Major mode, meaning that a Major triad is built off the Root Third and Fifth of the mode.
        A lower case Roman numeral indicates a minor mode, meaning that a minor triad is built
        from the Root Third and Fifth of the mode. The 'o' Next to the lower case vii of the Locrian
        Mode indicates that the mode is diminished.
      </p>
      <p>
        Created and Co-Designed by <span className="bold">Jake MG. </span>MasterJake1719@gmail.com<br />
        Implemented and Co-Designed by <span className="bold"><a href="https://aaronik.com" target="_blank">Aaron Sullivan</a></span><br />
      </p>
      <p>
        Made with love and given freely and without ads. If you like our work please consider&nbsp;
        <a href="https://paypal.me/aaronik" target="_blank">supporting us!</a> Thank you!
      </p>
      <code>Copyright © Aaronik Jake MG 2022-present</code>

    </div>
  )
}
