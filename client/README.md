# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

Journal:{
    id: 
    journalTitle
    journalImage
    Abbreviation
    Language
    ISSN
    DOI
    StartYear
    Published Articles
    articles   Article[]
}

model Article {
  id         Int      @id @default(autoincrement())
  articleTitle
  journalId  Int      // Foreign key
  journal    Journal  @relation(fields: [journalId], references: [id])
}