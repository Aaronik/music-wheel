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
      <p>
        🎧 Click the mode names to play the given mode from your speaker or
        headset; click the Roman Numerals to play the triad (Root, Third, and Fifth) of
        that mode.
      </p>
      <p>
        <span style={{ fontSize: '36px' }}>↻</span> Rotate the outer wheel so that the letter of the desired key aligns with the 'Root'
        position. By looking into the outermost ring of the chart each note's Interval
        relationship with the Root note is illuminated.
      </p>
      <p>
        ✎ A shorthand is used for each of the interval names:<br />
        Root corresponds to the root note or Unison and Octave<br />
        <span className="bold">m2</span> is the Minor Second, or Half Step<br />
        <span className="bold">M2</span> is the Major Second, or Whole Step<br />
        <span className="bold">m3</span> is the Minor Third<br />
        <span className="bold">M3</span> is the Major Third<br />
        <span className="bold">4</span> is the Fourth sometimes known as 'Perfect Fourth'<br />
        <span className="bold">Tritone</span> is the augmented fourth or diminished fifth<br />
        <span className="bold">5</span> is the Fifth or 'Perfect Fifth'<br />
        <span className="bold">m6</span> is the Minor Sixth<br />
        <span className="bold">M6</span> is the Major Sixth<br />
        <span className="bold">m7</span> is the minor seventh, and<br />
        <span className="bold">M7</span> is the Major Seventh.
      </p>
      <p>
        <span style={{ fontSize: '36px' }}>↻</span> Next Rotate the inner wheel so that the color of the desired mode aligns with the
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
        Ⅷ Next to each of the modes is a Roman numeral. An upper case Roman numeral represents a
        Major mode, meaning that a Major triad is built off the Root Third and Fifth of the mode.
        A lower case Roman numeral indicates a minor mode, meaning that a minor triad is built
        from the Root Third and Fifth of the mode. The 'o' Next to the lower case vii of the Locrian
        Mode indicates that the mode is diminished.
      </p>
      <hr/>
      <p>
        Created and Co-Designed by <span className="bold">Jake Masterson. </span>MasterJake1719@gmail.com<br />
        Implemented and Co-Designed by <span className="bold"><a href="https://aaronik.com" target="_blank">Aaron Sullivan</a></span><br />
      </p>
      <p>
        ♡ Made with love and given freely and without ads. If you like our work, please consider&nbsp;
        <a href="https://www.paypal.com/donate/?hosted_button_id=22EGXEL2CWHCN" target="_blank">supporting us!</a> Thank you!
      </p>
      <code>Copyright © Aaronik Jake Masterson 2022-present</code>

    </div>
  )
}
