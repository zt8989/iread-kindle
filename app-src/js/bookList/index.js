import { installController } from "./controller"

const bookList = angular.module("bookList", ["commonServices"])

installController(bookList)