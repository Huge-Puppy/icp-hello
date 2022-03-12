import Backgrounds "elements/bg";
import Bodies "elements/body";
import Eyes "elements/eyes";
import Hands "elements/hands";
import Mouths "elements/mouth";

module {
  public func createSvg(indices : [Nat]) : Text {
    assert(indices.size() >= 5);
    var svg : Text = "<svg version=\"1.1\" id=\"Layer_1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" viewBox=\"0 0 1000 1000\" style=\"enable-background:new 0 0 1000 1000;\" xml:space=\"preserve\">";
    svg #= Backgrounds.elements[indices[0]];
    svg #= Bodies.elements[indices[1]];
    svg #= Eyes.elements[indices[2]];
    svg #= Mouths.elements[indices[3]];
    svg #= Hands.elements[indices[4]];
    svg #= "</svg>";
    return svg;
  };
};

// inspiration and reference from icpuppy project code