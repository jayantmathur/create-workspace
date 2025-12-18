#' Get Contrasts
#'
#' This function is used to get contrasts from a given model and vector.
#'
#' @param model A model object. Provide lmer models with interactions.
#' @param vector A vector. Provide a vector of the form ~ A | B.
#'
#' @return A data frame with the contrasts.
#'
#' @importFrom emmeans emmeans contrast
#' @importFrom dplyr mutate across slice
#'
#' @examples
#' \dontrun{
#' score_model <- lmer(
#'     Score ~ Condition + Stage + Condition:Stage + (1 | PID),
#'     data = data,
#'     control = control
#' )
#'
#' get_contrasts(score_model, ~ Stage | Condition)
#'
#' kg_model <- lmer(
#'     Score ~ Condition + Process + Quiz +
#'         Condition:Quiz + Process:Quiz + Condition:Process +
#'         Condition:Process:Quiz +
#'         (1 | ParticipantID),
#'     data = data,
#'     control = control
#' )
#'
#' get_contrasts(kg_model, ~ Quiz | Condition:Process)
#' }
#'
#' @export

get_contrasts <- function(model, vector) {
    output <- as.data.frame(
        emmeans::contrast(
            emmeans::emmeans(model, vector),
            method = "pairwise"
        )
    )

    output <- dplyr::mutate(
        output,
        dplyr::across(
            .cols = estimate:p.value, # nolint
            .fns = ~ round(.x, 3)
        ),
        df = round(df),
        estimate = -estimate, # nolint
        t.ratio = -t.ratio # nolint
    )

    output$xmin <- seq_len(nrow(output)) - 0.2
    output$xmax <- seq_len(nrow(output)) + 0.2

    return(output)
}
