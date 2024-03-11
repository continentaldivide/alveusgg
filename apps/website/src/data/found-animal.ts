export type FoundAnimalOption = {
  name: string;
  flow: FoundAnimalFlow;
};

export type FoundAnimalFlow = {
  prompt: Readonly<string[]>;
  options?: Readonly<FoundAnimalOption[]>;
};

const macros = {
  general: {
    rehab: (animal = "it", context = "") => [
      `${
        context ? `${context}, call` : "Call"
      } a wildlife rehabilitator. They will be able to help ${animal}, or give you advice on what to do next.`,
      "To find a local wildlife rehabilitator, you can try searching online, or contacting your region's wildlife agency, or a local veterinarian.",
    ],
    leave: (animal = "it") => [
      `Leave ${animal} alone and keep yourself, and any pets, away from it.`,
      `If you are still concerned, you can monitor ${animal} from a distance to make sure it is doing okay over a few days.`,
      `Do not feed or otherwise interfere with it, to avoid ${animal} becoming dependent on humans.`,
    ],
  },
} as const;

const data: FoundAnimalFlow = {
  prompt: ["What animal have you found in distress?"],
  options: [
    {
      name: "Bird",
      flow: {
        prompt: [
          "Is the bird injured?",
          "For example, does it look like it may have been attacked, is it bleeding, does it appear malnourished, or a wing is drooping?",
        ],
        options: [
          {
            name: "Yes",
            flow: {
              prompt: macros.general.rehab("an injured bird"),
            },
          },
          {
            name: "No",
            flow: {
              prompt: ["Does the bird have feathers?"],
              options: [
                {
                  name: "Yes",
                  flow: {
                    prompt: [
                      "The bird you've found is likely a fledgling.",
                      "It is normal for it to be on the ground, it has likely left the nest recently. The parents should still be looking after it and feeding it.",
                      "Is the bird safe from pets (dogs, cats, etc.) and people?",
                    ],
                    options: [
                      {
                        name: "Yes",
                        flow: {
                          prompt: macros.general.leave("the bird"),
                        },
                      },
                      {
                        name: "No",
                        flow: {
                          prompt: [
                            "Carefully move the bird to a safe location nearby, such as a bush or tree.",
                            "Once moved, leave the bird alone, keeping yourself and any pets away from it, and observe from a distance.",
                            "Are the parents still nearby?",
                          ],
                          options: [
                            {
                              name: "Yes",
                              flow: {
                                prompt: macros.general.leave("the bird"),
                              },
                            },
                            {
                              name: "No",
                              flow: {
                                prompt: macros.general.rehab(
                                  "the bird",
                                  "If you are sure the parents are not nearby, and do not return within a few hours",
                                ),
                              },
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
                {
                  name: "No",
                  flow: {
                    prompt: [
                      "The bird you've found is likely a nestling. It shouldn't be on the ground yet!",
                      "Can you locate the nest, and is it intact and safe to return the bird to?",
                    ],
                    options: [
                      {
                        name: "Yes",
                        flow: {
                          prompt: [
                            "Carefully return the bird to the nest.",
                            "Once returned, leave the bird alone, keeping yourself and any pets away from it, and observe from a distance.",
                            "Are the parents still nearby? Are they visiting the nest and showing interest in the bird?",
                          ],
                          options: [
                            {
                              name: "Yes",
                              flow: {
                                prompt: macros.general.leave("the bird"),
                              },
                            },
                            {
                              name: "No",
                              flow: {
                                prompt: macros.general.rehab(
                                  "the bird",
                                  "If you are sure the parents are not nearby, and do not return within a few hours",
                                ),
                              },
                            },
                          ],
                        },
                      },
                      {
                        name: "No",
                        flow: {
                          prompt: macros.general.rehab(
                            "the bird",
                            "If you cannot locate a suitable nest, and if you are sure the parents are not nearby, and do not return within a few hours",
                          ),
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      name: "Deer/Fawn",
      flow: {
        prompt: [
          "Is the deer injured?",
          "For example, does it look like it may have been attacked, is it bleeding, is it unable to walk?",
        ],
        options: [
          {
            name: "Yes",
            flow: {
              prompt: [
                "Do not approach or try to handle the deer, as this may scare it and lead to further injury.",
                ...macros.general.rehab("an injured deer"),
              ],
            },
          },
          {
            name: "No",
            flow: {
              prompt: [
                "Is the deer trapped or stuck?",
                "For example, is it stuck in a fence, or in a hole?",
              ],
              options: [
                {
                  name: "Yes",
                  flow: {
                    prompt: [
                      "Do not approach or try to handle the deer, as this may scare it and lead to further injury.",
                      ...macros.general.rehab("a trapped deer"),
                    ],
                  },
                },
                {
                  name: "No",
                  flow: {
                    prompt: ["Is the deer alone?"],
                    options: [
                      {
                        name: "Yes",
                        flow: {
                          prompt: [
                            "This is normal, do not worry. Younger deer (fawns) are often left alone for long periods of time. The mother should return to feed them, often toward the end of the day.",
                            "If you are still concerned, you can monitor the deer from a distance to make sure the mother is still caring for it. Do not approach or try to handle the deer, as your scent may lead to the mother abandoning it.",
                            ...macros.general.rehab(
                              "a deer",
                              "If you don't see the mother return over the next couple of days",
                            ),
                          ],
                        },
                      },
                      {
                        name: "No",
                        flow: {
                          prompt: macros.general.leave("the deer"),
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      name: "Cat",
      flow: {
        prompt: [
          "Does the cat appear to be sick, injured, in danger, or a nursing kitten with no mama in sight?",
          "For example, is the cat is lying down and will not get up, is limping, or has blood anywhere on their body.",
        ],
        options: [
          {
            name: "Yes",
            flow: {
              prompt: macros.general.rehab("the cat"),
            },
          },
          {
            name: "No",
            flow: {
              prompt: ["Has the cat been outside for over 24 hours?"],
              options: [
                {
                  name: "Yes",
                  flow: {
                    prompt: [
                      "Check for a collar, if the cat has one try and get in contact with the owner. If the cat has no collar, you can take the cat to the nearest animal shelter to check for a microchip.",
                      "If the cat does not have a microchip, leave the cat where it is. You can attempt to locate the owner by asking neighbours, or leaving out flyers with photos and detailed information about the cat.",
                      ...macros.general.rehab(
                        "the cat",
                        "If the cat appears to be feral/unowned",
                      ),
                    ],
                  },
                },
                {
                  name: "No",
                  flow: {
                    prompt: macros.general.leave("the cat"),
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      name: "Squirrel",
      flow: {
        prompt: [
          "Does any of the following apply to the squirrel?",
          "- It is bleeding, has an open wound, or has a broken bone.",
          "- It has been in a cat's or dog's mouth.",
          "- It is covered in fly eggs (looks like small grains of rice).",
          "- It is cold, wet, or crying nonstop.",
        ],
        options: [
          {
            name: "Yes",
            flow: {
              prompt: macros.general.rehab("the squirrel"),
            },
          },
          {
            name: "No",
            flow: {
              prompt: [
                "Does the squirrel have a fluffed-out tail, a body longer than 6 inches (excluding the tail), or is approaching humans/pets?",
              ],
              options: [
                {
                  name: "Yes",
                  flow: {
                    prompt: [
                      "This is likely a juvenile squirrel, you do not need to intervene.",
                      ...macros.general.leave("the squirrel"),
                    ],
                  },
                },
                {
                  name: "No",
                  flow: {
                    prompt: ["Is the squirrel alone?"],
                    options: [
                      {
                        name: "Yes",
                        flow: {
                          prompt: macros.general.rehab(
                            "the squirrel",
                            "If you are sure the parents are not nearby, and do not return within a few hours",
                          ),
                        },
                      },
                      {
                        name: "No",
                        flow: {
                          prompt: macros.general.leave("the squirrel"),
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      name: "Raccoon",
      flow: {
        prompt: ["Does the raccoon appear to be sick or injured?"],
        options: [
          {
            name: "Yes",
            flow: {
              prompt: macros.general.rehab("the raccoon"),
            },
          },
          {
            name: "No",
            flow: {
              prompt: [
                "Have you found a baby raccoon that's alone with no mother in sight?",
              ],
              options: [
                {
                  name: "Yes",
                  flow: {
                    prompt: [
                      "Be careful not to create an orphan raccoon accidentally. When a baby raccoon is separated from its mother, it will stay where it is until the mother returns.",
                      "Monitor the baby from a distance to make sure the mother is still caring for it. Do not attempt to feed or otherwise care for the baby, as this may lead to it becoming dependent on humans.",
                      ...macros.general.rehab(
                        "the baby raccoon",
                        "If the mother does return after 24 hours",
                      ),
                    ],
                  },
                },
                {
                  name: "No",
                  flow: {
                    prompt: macros.general.leave("the raccoon"),
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as const;

export default data;
