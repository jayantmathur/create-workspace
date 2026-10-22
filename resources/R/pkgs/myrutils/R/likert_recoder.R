#' Likert Recoder
#'
#' This function recodes Likert scale responses in specified columns of a data frame.
#'
#' @param data A data frame containing the data to be recoded.
#' @param columns A vector of column names in 'data' that should be recoded.
#' @param levels A vector of levels in the Likert scale,
#' in the order they should be recoded.
#'
#' @return A data frame with the specified columns recoded.
#'
#' @examples
#' \dontrun{
#' pre_data <- likert_recoder(
#'     pre_data,
#'     c("AM", "ME", "DfME"),
#'     c("never", "some informal", "some formal", "lots of", "expert")
#' )
#' }
#'
#' @export

likert_recoder <- function(data, columns, levels) {
    replacements <- seq_along(levels)

    for (column in columns) {
        for (i in replacements) {
            data[[column]] <- ifelse(
                grepl(
                    levels[i],
                    data[[column]]
                ),
                i,
                data[[column]]
            )
        }
        data[[column]] <- as.integer(data[[column]])
    }


    return(data)
}
