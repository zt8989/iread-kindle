import { installController } from "./controller"

const bookDetail = angular.module("bookDetail", ["commonServices", "commonDirectives"])

installController(bookDetail)