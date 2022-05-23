export const signupText = {
  type: "doc",
  content: [
    {
      type: "heading",
      attrs: {
        level: 1
      },
      content: [
        {
          type: "text",
          text: "La tua azienda"
        }
      ]
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          text: "Qua puoi parlare della tua azienda e dire ad esempio:"
        }
      ]
    },
    {
      type: "bulletList",
      content: [
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: "Di cosa si occupa"
                }
              ]
            }
          ]
        },
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: "Quanto è grande"
                }
              ]
            }
          ]
        }
      ]
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          text: "Ecc."
        }
      ]
    },
    {
      type: "blockquote",
      content: [
        {
          type: "paragraph",
          content: [
            {
              type: "text",
              text: "Sii esaustivo!"
            }
          ]
        }
      ]
    }
  ]
};
export default signupText;
