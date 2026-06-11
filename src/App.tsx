import { ChakraProvider } from '@chakra-ui/react'
import AcademicHome from './templates/academic/AcademicHome'
import AcademicLayout from './templates/academic/AcademicLayout'
import academicTheme from './templates/academic/academicTheme'
import './i18n'

function App() {
  return (
    <ChakraProvider theme={academicTheme}>
      <AcademicLayout>
        <AcademicHome />
      </AcademicLayout>
    </ChakraProvider>
  )
}

export default App
