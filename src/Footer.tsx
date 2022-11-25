import React from "react"
import "./Footer.css"

// Just b/c at the time it was easier than styling <a> tags which is for some reason hard
function ButtonAndLink(props: React.PropsWithChildren<{ url: string }>) {
  const onClick = () => window.open(props.url, '_blank')

  return (
    <button onClick={onClick}>
      <a target="_blank" href={props.url}>
        {props.children}
      </a>
    </button>
  )
}

type FooterProps = {
  onHelpClick: () => void
}

      // <ButtonAndLink url="https://github.com/aaronik/music-wheel"><img id="github" src="github.png" /></ButtonAndLink>
export default function Footer({ onHelpClick }: FooterProps) {
  return (
    <div id="footer">
      <button onClick={onHelpClick}>?</button>
      <ButtonAndLink url="https://www.paypal.com/donate/?hosted_button_id=22EGXEL2CWHCN">Donate</ButtonAndLink>
    </div>
  )
}
