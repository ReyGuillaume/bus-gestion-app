// /**
//  * @jest-environment jsdom
//  */

// import { createFooter } from "../components/footer";

// test("Le footer est bien créé", () => {
//   const temp = document.createElement("footer")
//   temp.id = "footer"
//   document.body.appendChild(temp)

//   const footer = createFooter()
//   const ul = footer.querySelector(".footerList")

//   expect(document.contains(footer)).toBe(true)
//   expect(ul).not.toBeUndefined()
//   ul.childNodes.forEach(li => {
//     expect(li.children[0].classList).toContain('footerList__item')
//     expect(li.children[0].classList).toContain('unstyled-button')
//   })
// })