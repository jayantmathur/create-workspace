#' Recode values in a vector based on a mapping of old and new values
#'
#' This function takes in a vector and a mapping of old and new values, and returns a new vector with the old values replaced by the new values according to the mapping.
#'
#' @param x A vector to be recoded
#' @param old_values A vector of old values to be replaced
#' @param new_values A vector of new values to replace the old values
#'
#' @return A recoded vector
#'
#' @importFrom stats setNames
#'
#' @examples
#' x <- c(1, 2, 3, 4, 5)
#' old_values <- c(1, 2, 3)
#' new_values <- c("one", "two", "three")
#' recoded <- recoder(x, old_values, new_values)
#'
#' @export
recoder <- function(x, old_values, new_values) {
    # Create a named vector of old and new values
    recode_map <- setNames(new_values, old_values)

    # Recode the input vector using the map
    recoded <- recode_map[x]

    # Return the recoded vector
    return(recoded)
}
